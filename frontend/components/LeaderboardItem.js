export default function LeaderboardItem({rank, name, score}) {
    return (
        <tr>
        <td>{rank}</td>
        <td>{name}</td>
        <td>{score}</td>
        </tr>
    )
}